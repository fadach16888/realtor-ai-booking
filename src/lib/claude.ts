import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const PlatformContentSchema = z.object({
  facebook: z.object({ content: z.string() }),
  instagram: z.object({ content: z.string(), hashtags: z.string() }),
  twitter: z.object({ tweets: z.array(z.string()) }),
  s591: z.object({ title: z.string(), description: z.string() }),
  s5168: z.object({ title: z.string(), description: z.string() }),
  lehouse: z.object({ title: z.string(), description: z.string() }),
});

export type PlatformContent = z.infer<typeof PlatformContentSchema>;

export async function generateContentForAllPlatforms(propertyInfo: {
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
}): Promise<PlatformContent> {
  if (!process.env.CLAUDE_API_KEY) {
    throw new Error("CLAUDE_API_KEY not configured");
  }

  const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

  const prompt = `你是一位房仲文案專家。根據以下房源資訊，為各平台生成文案。

房源資訊：
- 標題：${propertyInfo.title}
- 地點：${propertyInfo.location}
- 價格：NT$${propertyInfo.price.toLocaleString()}
- 規格：${propertyInfo.bedrooms}房${propertyInfo.bathrooms}衛，${propertyInfo.area}m²
- 描述：${propertyInfo.description}

各平台要求：
- Facebook：溫暖親切、200-500 字、突出特色、號召看房
- Instagram：視覺化、年輕語氣、100-300 字，hashtags 欄位放 5-10 個相關標籤
- Twitter：簡潔精悍，拆成 3 則推文，每則不超過 280 字元
- 591 / 5168 / 樂屋網：標題 30-50 字，描述 200-400 字，強調物件優勢`;

  const response = await client.messages.parse({
    model: "claude-opus-5",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { format: zodOutputFormat(PlatformContentSchema) },
    messages: [{ role: "user", content: prompt }],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("Claude declined to generate content for this listing");
  }

  if (!response.parsed_output) {
    throw new Error("Claude response did not match the expected schema");
  }

  return response.parsed_output;
}
