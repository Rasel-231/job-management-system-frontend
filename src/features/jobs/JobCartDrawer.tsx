"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { removeFromCart, clearCart } from "./jobCartSlice";
import { submitTask } from "../tasks/taskApi";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function JobCartDrawer() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.jobCart.items);
  const [isOpen, setIsOpen] = useState(false);
  const [links, setLinks] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const handleSubmit = async (jobId: string) => {
    const submissionLink = links[jobId];
    if (!submissionLink) {
      toast.error("Please provide a submission link");
      return;
    }
    setSubmittingId(jobId);
    try {
      await submitTask({ jobId, submissionLink });
      toast.success("Task submitted for review");
      dispatch(removeFromCart(jobId));
    } catch {
      // handled globally
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Job Cart {cartItems.length > 0 && `(${cartItems.length})`}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 z-50 h-full w-full sm:w-96 bg-white shadow-lg p-6 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <h2 className="text-lg font-semibold mb-4">Your Job Cart</h2>

              {cartItems.length === 0 ? (
                <p className="text-sm text-gray-500">No jobs in your cart yet.</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-xs text-gray-500">Reward: ${item.reward}</p>
                        </div>
                        <button onClick={() => dispatch(removeFromCart(item.id))} className="text-xs text-red-500 hover:underline">
                          Remove
                        </button>
                      </div>
                      <Input
                        placeholder="Paste your submission link"
                        value={links[item.id] || ""}
                        onChange={(e) => setLinks((prev) => ({ ...prev, [item.id]: e.target.value }))}
                      />
                      <Button size="sm" className="w-full" disabled={submittingId === item.id} onClick={() => handleSubmit(item.id)}>
                        {submittingId === item.id ? "Submitting..." : "Submit Task"}
                      </Button>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-red-500" onClick={() => dispatch(clearCart())}>
                    Clear Cart
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
