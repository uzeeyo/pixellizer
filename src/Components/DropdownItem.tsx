interface DropdownItemProps {
  value: number;
  itemClicked: (value: number) => void; 
}

export default function DropdownItem(props: DropdownItemProps) {
  return (
    <p
      onClick={() => props.itemClicked(props.value)}
      className={`text-center border-lg hover:bg-[#4e4e4e] cursor-pointer select-none`}
    >{`${props.value}x${props.value}`}</p>
  );
}
