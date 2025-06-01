import https from "https";

export function askAI(message) {
  const options = {
    method: "POST",
    hostname: "open-ai21.p.rapidapi.com",
    port: null,
    path: "/conversationllama",
    headers: {
      "x-rapidapi-key": "56aaf822c1msh70ebd0f465ba262p170fc4jsncde11e6bb60e", // Use env var
      "x-rapidapi-host": "open-ai21.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        try {
          const body = JSON.parse(Buffer.concat(chunks).toString());
          const aiReply = body?.result || "No response";

          resolve(aiReply);
        } catch (err) {
          console.log("error", err);
          reject(err);
        }
      });
    });

    req.on("error", reject);

    const payload = JSON.stringify({
      model: "deepseek-v3",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      web_access: false,
    });

    req.write(payload);
    req.end();
  });
}
