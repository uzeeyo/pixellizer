interface ColorBlockProps {
  color: string;
  id: string;
  onRemove: () => void;
}

export default function ColorBlock(props: ColorBlockProps) {
  return (
    <div className="relative group">
      <div
        id={props.id}
        className="w-10 h-10 rounded-lg scale-up border-2"
        style={{ backgroundColor: props.color }}
      ></div>
      <button
        onClick={props.onRemove}
        className="absolute -top-2 -right-2 w-5 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
