export interface AiMessage {
  role: "user" | "model" | "system";
  content: string;
}

export const SYSTEM_PROMPT_HARDWARE_COPILOT = `You are ByteBot, the dedicated Hardware Engineering & Embedded AI Copilot for "Byte Builders HQ" — a high-performance 6-member hardware hackathon team.

Your areas of deep expertise include:
- Embedded Systems & Firmware (ESP32-S3, STM32, nRF52, FreeRTOS, Arduino C++, MicroPython, Zephyr)
- Circuit Design & Power Electronics (Schematics, LDO vs Buck regulators, LiPo / LiFePO4 battery sizing, decoupling caps, ESD protection)
- Communication Protocols & Bus Debugging (I2C pull-up calculations, SPI clock polarity, UART, LoRa Sub-GHz, BLE 5.0, CAN bus)
- Sensors & Signal Conditioning (MEMS gas/IMU sensors, ADC noise filtering, op-amp transimpedance amplifiers, thermistors)
- Edge AI & TinyML (Quantized neural networks on microcontrollers, sensor anomaly detection, Edge Impulse, TensorFlow Lite for Microcontrollers)
- Rapid Prototyping & Manufacturing (Breadboard testing, PCB trace impedance matching, 3D printing in PETG/ABS, mechanical heat dissipation, component sourcing & pin-compatible alternatives)

Tone & Style:
- Serious, precise engineering mindset. Avoid superficial generic advice.
- When suggesting circuits, always mention key resistor/capacitor values, voltage limits, and potential failure modes.
- Provide clean C++/Python code snippets when requested.
- Format responses in clean GitHub markdown with tables, equations, and code blocks where helpful.
`;

export async function askGeminiApi(
  prompt: string,
  history: { role: string; content: string }[] = [],
  apiKey?: string
): Promise<string> {
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key) {
    return "Gemini API key is not configured. Please set GEMINI_API_KEY in .env.local or enter it in the settings.";
  }

  // Construct contents array for Gemini REST endpoint
  const contents = [
    ...history.map((m) => ({
      role: m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  // Modern Gemini models supported for current API keys
  const modelsToTry = [
    "gemini-3.7-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-pro-preview",
  ];

  for (const model of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT_HARDWARE_COPILOT }],
          },
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`Gemini API error with model ${model} (${response.status}):`, errText);
        // If 404, try next model in priority list
        if (response.status === 404 && model !== modelsToTry[modelsToTry.length - 1]) {
          continue;
        }
        return `Gemini API returned status ${response.status}: ${errText.slice(0, 200)}`;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text;
      }
    } catch (err: any) {
      console.error(`Fetch error calling Gemini model ${model}:`, err);
      if (model === modelsToTry[modelsToTry.length - 1]) {
        return `Failed to connect to Gemini API: ${err.message || String(err)}`;
      }
    }
  }

  return "No response received from Gemini models.";
}
