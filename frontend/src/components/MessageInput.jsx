import { Image, Loader2, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const sendMessage = useChatStore((state) => state.sendMessage);
  const isSendingMessage = useChatStore((state) => state.isSendingMessage);

  const fileInputRef = useRef(null);

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please upload an image");
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    } // remove the file from the input field
  }

  function removeImagePreview() {
    setSelectedFile(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    } // remove the file from the input field
  }

  async function handleSendMessage(e) {
    e.preventDefault();

    if (!text.trim() && !selectedFile) return;

    const formData = new FormData();

    formData.append("text", text);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const success = await sendMessage(formData);

    if (success) {
      // reset form
      setText("");
      setSelectedFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImagePreview}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`btn btn-circle btn-sm sm:btn-md
                     ${imagePreview ? "text-emerald-500" : "text-base"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="size-4 sm:size-5" />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm sm:btn-md btn-circle"
          disabled={(!text.trim() && !imagePreview) || isSendingMessage}
        >
          {isSendingMessage ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="pr-0.5 size-4.5 sm:size-5.5" />
          )}
        </button>
      </form>
    </div>
  );
}
