#### Sentence Transformer
import os
from abc import abstractmethod
from dataclasses import dataclass

from huggingface_hub import login
from numpy import float32, ndarray
from torch import Tensor


@dataclass
class Model:
    @abstractmethod
    def encode(
        self,
        sentences: str | list[str],
        max_active_dims: int,
        convert_to_tensor: bool,  # noqa: FBT001
    ) -> tuple[Tensor | ndarray[float32]]:
        pass


class Transformer:
    def __init__(self, sentences: list[str], query: str) -> None:
        self.sentences = sentences
        self.query = query
        login(token=os.environ["SPLADE_TOKEN"])

    def embeddings(self, model: Model) -> tuple[Tensor | ndarray[float32]]:
        sentences_embeddings = model.encode(
            self.sentences,
            max_active_dims=64,
            convert_to_tensor=True,
        )
        query_embeddings = model.encode([self.query], convert_to_tensor=True)

        return (sentences_embeddings, query_embeddings)

    def dense_encoder(self) -> None:
        from sentence_transformers import (
            SimilarityFunction,
            SparseEncoder,
        )

        # Download from the 🤗 Hub
        model = SparseEncoder(
            "msmarco-distilbert-cos-v5",
            similarity_fn_name=SimilarityFunction.COSINE,
        )
        embeddings = self.embeddings(model)

        return model.similarity(embeddings[0], embeddings[1])

    def spare_encoder(self) -> list[tuple[int, int | float | bool]]:
        from sentence_transformers import (
            SimilarityFunction,
            SparseEncoder,
        )

        # Download from the 🤗 Hub
        model = SparseEncoder(
            "naver/splade-v3",
            similarity_fn_name=SimilarityFunction.COSINE,
        )

        embeddings = self.embeddings(model)

        similarities = model.similarity(embeddings[0], embeddings[1])

        # similarities is a tensor with shape (num_sentences, 1), flatten it
        similarities = similarities.squeeze(1)

        return sorted(
            [(idx, score.item()) for idx, score in enumerate(similarities)],
            key=lambda x: x[1],
            reverse=True,
        )

    def re_rank_with_cross_encoder(
        self,
        candidates: list[tuple[int, float]],
        top_k: int = 5,
    ) -> list[tuple[int, float]]:
        from sentence_transformers import CrossEncoder

        # Initialize CrossEncoder for re-ranking
        cross_model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L6-v2")

        # Prepare input pairs (query, candidate sentence)
        candidate_texts = [self.sentences[idx] for idx, _ in candidates[:top_k]]
        pairs = [[self.query, text] for text in candidate_texts]

        # Compute cross-encoder scores (higher is better)
        cross_scores = cross_model.predict(pairs)

        # Combine indices with cross-encoder scores
        re_ranked = list(
            zip([idx for idx, _ in candidates[:top_k]], cross_scores, strict=False),
        )

        # Sort re-ranked list by cross-encoder scores descending
        return sorted(re_ranked, key=lambda x: x[1], reverse=True)

    def run(self) -> list[tuple[int, float]]:
        # 1. Sparse retrieval with SPLADE
        candidates = self.spare_encoder()

        # 2. Rerank top candidates with Cross-Encoder
        return self.re_rank_with_cross_encoder(candidates, top_k=25)
