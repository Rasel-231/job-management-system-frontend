"use client";

import { TJob } from "./types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addToCart } from "./jobCartSlice";
import { Button } from "../../components/ui/button";

// CLIENT COMPONENT — the single interactive piece on an otherwise fully
// server-rendered job detail page. Kept small and isolated on purpose:
// "use client" only where actually necessary.
export default function JobDetailAddToCart({ job }: { job: TJob }) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.jobCart.items);
  const isInCart = cartItems.some((item) => item.id === job.id);

  return (
    <Button disabled={isInCart} onClick={() => dispatch(addToCart(job))}>
      {isInCart ? "In Cart" : "Add to Cart"}
    </Button>
  );
}
