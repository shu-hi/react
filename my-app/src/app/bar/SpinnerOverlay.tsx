import { Triangle } from "react-loader-spinner";
import "./SpinnerOverlay.css";

type Props = {
  visible: boolean;
};

const SpinnerOverlay = ({ visible }: Props) => {
  if (!visible) return null;

  return (
    <div className="spinner-overlay">
      <Triangle
        height={80}
        width={80}
        color="#564da9ff"
        ariaLabel="triangle-loading"
        visible={true}
      />
    </div>
  );
};

export default SpinnerOverlay;
