import Link from "next/link";
import { Container } from "../Container/Container";

export const BookingNotFound = ({ description }: { description?: string }) => (
  <Container>
    <div className="w-full flex flex-col py-8 gap-6 items-center text-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Booking Not Found</h1>
        <p className="text-lg text-gray-600 max-w-md">
          {description ||
            "We couldn't find a booking with the reference number provided. Please check the link and try again."}
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="w-full block text-center font-bold text-xl py-3 bg-primary border-2 border-black rounded capitalize"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  </Container>
);
