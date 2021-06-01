import { useEffect, useState } from "react";

export function Async() {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isButtonInvisible, setIsButtonInvisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsButtonVisible(true);
    }, 1000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsButtonInvisible(true);
    }, 2000);
  }, []);

  return (
    <div>
      <div>Hello World</div>
      {isButtonVisible && <button>Button</button>}
      {!isButtonInvisible && <button>Button 2</button>}
    </div>
  );
}
