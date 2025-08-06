def spawn_chunks(text: str, max_tokens: int = 300, overlap: int = 50) -> list[str]:
    import spacy
    from tiktoken import get_encoding

    tokenizer = get_encoding("cl100k_base")

    spacy.prefer_gpu()
    nlp = spacy.load("xx_sent_ud_sm")

    doc = nlp(text)
    sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]
    chunks, current, tok_count = [], [], 0
    for sent in sentences:
        tokens = tokenizer.encode(sent)
        if tok_count + len(tokens) > max_tokens and current:
            chunks.append(" ".join(current))
            # move back to overlap
            back, idx = overlap, len(current) - 1
            while idx >= 0 and back > 0:
                back -= len(tokenizer.encode(current[idx]))
                idx -= 1
            current = current[idx + 1 :] if idx >= 0 else []
            tok_count = sum(len(tokenizer.encode(s)) for s in current)
        current.append(sent)
        tok_count += len(tokenizer.encode(sent))
    if current:
        chunks.append(" ".join(current))
    return chunks
