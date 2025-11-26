import { useEffect } from "react";

const Chatbot = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jotfor.ms/agent/embedjs/0199fffb52a07326bd3455ea587450084d07/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null; // No visible element needed
};

export default Chatbot;
