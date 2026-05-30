import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, Upload } from "lucide-react"
import { motion } from "framer-motion"

function App() {

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hey! I'm your AI study assistant."
    }
  ])

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [messages, loading])

  const sendMessage = async () => {

    if (!input.trim()) return

    const userMessage = {
      role: "user",
      text: input
    }

    setMessages((prev) => [...prev, userMessage])

    const currentInput = input

    setInput("")
    setLoading(true)

    try {

      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: currentInput
        })
      })

      const data = await response.json()

      console.log(data)

      const aiMessage = {
        role: "ai",
        text: data.message
      }

      setMessages((prev) => [...prev, aiMessage])

    } catch (error) {

      const errorMessage = {
        role: "ai",
        text: error.toString()
      }

      setMessages((prev) => [...prev, errorMessage])

    } finally {

      setLoading(false)

    }
  }

  const uploadPDF = async (e) => {

    const file = e.target.files[0]

    if (!file) return

    const formData = new FormData()

    formData.append("file", file)

    try {

      await fetch("http://127.0.0.1:8000/upload-pdf", {
        method: "POST",
        body: formData
      })

      const pdfMessage = {
        role: "ai",
        text: `PDF uploaded successfully: ${file.name}`
      }

      setMessages((prev) => [...prev, pdfMessage])

    } catch (error) {

      const errorMessage = {
        role: "ai",
        text: "Failed to upload PDF."
      }

      setMessages((prev) => [...prev, errorMessage])

    }
  }
const clearPDF = async () => {

  try {

    await fetch("http://127.0.0.1:8000/clear-pdf", {
      method: "POST"
    })

  } catch (error) {

    console.log(error)

  }

}
  return (
    <div className="h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white flex overflow-hidden">

      {/* Sidebar */}
      <div className="w-72 border-r border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col">

        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-500 p-2 rounded-2xl">
            <Sparkles size={20} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              AI Study
            </h1>

            <p className="text-zinc-400 text-sm">
              Smart learning assistant
            </p>
          </div>
        </div>

        <div className="space-y-3">

  <label className="bg-blue-600 hover:bg-blue-700 transition rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 cursor-pointer">

    <Upload size={18} />

    Upload PDF

    <input
      type="file"
      accept=".pdf"
      hidden
      onChange={uploadPDF}
    />

  </label>

<button
  onClick={async () => {

    await clearPDF()

    setMessages([
      {
        role: "ai",
        text: "Hey! I'm your AI study assistant."
      }
    ])

  }}
  className="w-full bg-zinc-800 hover:bg-zinc-700 transition rounded-2xl py-4 font-semibold"
>
  New Chat
</button>

</div>

      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <div className="border-b border-white/10 backdrop-blur-xl bg-white/5 p-6 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              AI Study Assistant
            </h1>

            <p className="text-zinc-400 text-sm mt-1">
              Ask coding, math, or study questions
            </p>
          </div>

        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {messages.map((msg, index) => (

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-2xl px-6 py-4 rounded-3xl shadow-2xl border ${
                  msg.role === "user"
                    ? "bg-blue-600 border-blue-500"
                    : "bg-white/5 border-white/10 backdrop-blur-xl"
                }`}
              >

                <div className="prose prose-invert max-w-none break-words">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "")

                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      },
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>

              </div>

            </motion.div>

          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-2xl px-6 py-4 rounded-3xl shadow-2xl border bg-white/5 border-white/10 backdrop-blur-xl">

                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>

              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />

        </div>

        {/* Input */}
        <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-xl">

          <div className="flex items-center gap-4 bg-zinc-900/80 border border-white/10 rounded-3xl px-6 py-3">

            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage()
                }
              }}
              className="flex-1 bg-transparent outline-none text-white placeholder:text-zinc-500"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 transition p-4 rounded-2xl"
            >
              <Send size={20} />
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default App