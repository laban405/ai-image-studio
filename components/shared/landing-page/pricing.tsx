// "use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { plans } from "@/constants";
import Checkout from "../Checkout";
import { auth, SignedIn } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.actions";



const Pricing = async() => {
  const { userId } = auth();
  const user = await getUserById(userId??"");

  return (
    <div
      id="pricing"
      className="flex flex-col items-center justify-center py-12 xs:py-20 px-6"
    >
      <h1 className="text-3xl xs:text-4xl md:text-5xl font-bold text-center tracking-tight">
        Pricing
      </h1>
       <p className="mt-3 xs:text-lg text-center text-muted-foreground">Start Free. Upgrade As You Grow.</p>
     
      <div className="mt-12 max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
         {plans.slice(0,6).map((plan) => (
            <li key={plan.name} className="credits-item">
              <div className="flex-center flex-col gap-3">
                <Image src={plan.icon} alt="check" width={50} height={50} />
                <p className="p-20-semibold mt-2 ">
                  {plan.name}
                </p>
                <p className="h1-semibold ">KSh {plan.price}</p>
                {/* <p className="p-16-regular">{plan.credits} Credits</p> */}
              </div>

              {/* Inclusions */}
              <ul className="flex flex-col gap-5 py-9">
                {plan.inclusions.map((inclusion) => (
                  <li
                    key={plan.name + inclusion.label}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src={`/assets/icons/${
                        inclusion.isIncluded ? "check.svg" : "cross.svg"
                      }`}
                      alt="check"
                      width={24}
                      height={24}
                    />
                    <p className="p-16-regular">{inclusion.label}</p>
                  </li>
                ))}
              </ul>

              {plan.name === "Free" ? (
                <Button variant="outline" className="credits-btn">
                  Free Consumable
                </Button>
              ) : (
                <SignedIn>
                  <Checkout
                    plan={plan.name}
                    amount={plan.price}
                    credits={plan.credits}
                    buyerId={user._id}
                  />
                </SignedIn>
              )}
            </li>
          ))}
      </div>
    </div>
  );
};

export default Pricing;
