export default function MessageSkeleton() {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(4).fill(null);

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}
        >
          <div className="chat-image avatar hidden sm:block">
            <div className="size-10 rounded-full">
              <div className="skeleton w-full h-full rounded-full" />
            </div>
          </div>

          <div className="chat-header mb-1">
            <div className="skeleton h-4 w-16" />
          </div>

          <div className="chat-bubble bg-transparent p-0">
            <div className="skeleton h-16 max-w-[200px] min-w-[150px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
