const express = require("express");  // Для веб-сервера
const WebSocket = require("ws");     // Для реального времени (чат)
const path = require("path");        // Для работы с путями к файлам
const translate =require("@vitalets/google-translate-api");

// Создаём сервер Express
const app = express();

// Настраиваем сервер на отдачу файлов из папки public (index.html и стили)
app.use(express.static(path.join(__dirname, "public")));

// Создаём HTTP сервер
const server = require("http").createServer(app);

// Создаём WebSocket сервер на основе HTTP
const wss = new WebSocket.Server({ server });

// Когда подключается пользователь
wss.on("connection", (ws) => {
  // Когда пользователь присылает сообщение
  ws.on("message", async (msg) => {
	  try {   //Переводим входящее сообщение на русский
	  const res = await
	  translate(msg.toString(), { to: "ru" });  //Формируем текст с оригиналом и переводом
	  const translatedMsg = '💬 ${msg}\n🔹 Перевод: ${res.text}';
    // Рассылаем сообщение всем пользователям, кто подключен к чату
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(translatedMsg);
        }
      });
    } catch (e) {
      console.error("Ошибка перевода:", e);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server started on port", PORT));