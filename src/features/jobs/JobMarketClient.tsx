"use client";

import { motion } from "framer-motion";
import { TJob } from "./types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addToCart } from "./jobCartSlice";
import { Button } from "../../components/ui/button";

// CLIENT COMPONENT: receives server-fetched data as props, owns only the
// interactive bits (Redux cart state, click handlers, animation).
export default function JobMarketClient({ initialJobs }: { initialJobs: TJob[] }) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.jobCart.items);
  const isInCart = (id: string) => cartItems.some((item) => item.id === id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      {initialJobs.map((job, i) => (
        <motion.div
          key={job.id}
          className="border rounded-lg p-4 shadow-sm bg-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.03 }}
        >
          <h3 className="font-semibold text-lg">{job.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{job.description}</p>
          <p className="mt-2 font-medium">Reward: ${job.reward}</p>
          <Button
            className="mt-3 w-full"
            disabled={isInCart(job.id)}
            onClick={() => dispatch(addToCart(job))}
          >
            {isInCart(job.id) ? "In Cart" : "Add to Cart"}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
