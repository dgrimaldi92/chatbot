import { ChannelCredentials } from "@grpc/grpc-js";
import { GrpcTransport } from "@protobuf-ts/grpc-transport";
import { LLMClient } from "./llm/llm_service.client";
import { ScraperServiceClient } from "./scraper/scrape_service.client";

const llmTransport = new GrpcTransport({
	channelCredentials: ChannelCredentials.createInsecure(),
	host: "127.0.0.1:50051",
});

export const llmClient = new LLMClient(llmTransport);

const searchTransport = new GrpcTransport({
	channelCredentials: ChannelCredentials.createInsecure(),
	host: "127.0.0.1:50052",
});

export const searchClient = new ScraperServiceClient(searchTransport);
