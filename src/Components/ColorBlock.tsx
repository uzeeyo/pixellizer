interface ColorBlockProps {
  color: string;
  id: string;
}

export default function ColorBlock(props: ColorBlockProps) {
  return (
    <div
      id={props.id}
      className="w-10 h-10 rounded-lg scale-up border-2"
      style={{ backgroundColor: props.color }}
    ></div>
  );
}
