"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";
// import { checkoutCredits } from "@/lib/actions/transaction.action";

import { Button } from "../ui/button";
import { checkoutMpesaCredits } from "@/lib/actions/mpesa-transaction.action";
import { PhoneInput } from "./phone-input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { useForm } from "react-hook-form";

const FormSchema = z.object({
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});

const Checkout = ({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: "",
    },
  });

  // useEffect(() => {
  //   loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  // }, []);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      toast({
        title: "Order placed!",
        description: "You will receive an email confirmation",
        duration: 5000,
        className: "success-toast",
      });
    }

    if (query.get("canceled")) {
      toast({
        title: "Order canceled!",
        description: "Continue to shop around and checkout when you're ready",
        duration: 5000,
        className: "error-toast",
      });
    }
  }, []);

  // const onCheckout = async () => {
  //   const transaction = {
  //     plan,
  //     amount,
  //     credits,
  //     buyerId,
  //   };

  //   await checkoutCredits(transaction);
  // };

  const onCheckout = async (data: z.infer<typeof FormSchema>) => {
    console.log('onCheckout called with data:', data);
    
    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
      mpesaPhone: data.phone.replace("+", ""),
    };

    const response = await checkoutMpesaCredits(transaction);

    if (!response.success) {
      toast({
        title: "Payment failed!",
        description: response.error || "Something went wrong.",
        duration: 6000,
        className: "error-toast",
      });
    } else {
      toast({
        title: "Payment initiated!",
        description: "Check your phone to complete the payment.",
        duration: 6000,
        className: "success-toast",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onCheckout)}>
        <section>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel className="text-left">Phone Number</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    defaultCountry="KE"
                    focusInputOnCountrySelection
                    international
                    placeholder="Enter a phone number"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-left">
                  Enter a phone number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            role="link"
            className="w-full rounded-full bg-purple-gradient bg-cover"
          >
            Buy Credit
          </Button>
        </section>
      </form>
    </Form>
  );
};

export default Checkout;
