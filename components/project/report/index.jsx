import BurnDown from "./burndown";
import Categories from "./categories";

export default function Report() {
  return (
    <>
      <Categories />
      <BurnDown />
    </>
  );
}
