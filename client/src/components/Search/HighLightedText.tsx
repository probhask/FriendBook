type Props = {
  text: string;
  highLighText: string;
};
const HighLightedText = ({ highLighText, text }: Props): JSX.Element => {
  const parts = text.split(new RegExp(`(${highLighText})`, "gi"));
  return (
    <span>
      {parts.map((part, index) => {
        return part.toLowerCase() === highLighText.toLowerCase() ? (
          <b key={index} className="text-blue-500">
            {part}
          </b>
        ) : (
          part
        );
      })}
    </span>
  );
};
export default HighLightedText;
