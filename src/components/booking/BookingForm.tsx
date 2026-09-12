'use client';

import { VenueBookingForm } from './VenueBookingForm';

export { VenueBookingForm };

export interface BookingFormProps {
  boxId: string;
  boxName: string;
  pricePerDayPaise: number;
  depositPaise: number;
  userId?: string | null;
}

export function BookingForm({
  boxId,
  boxName,
  pricePerDayPaise,
  depositPaise,
  userId,
}: BookingFormProps) {
  return (
    <VenueBookingForm
      venueId={boxId}
      venueName={boxName}
      basePricePaise={pricePerDayPaise}
      depositPaise={depositPaise}
      capacityMax={10}
      capacityRecommended={6}
      userId={userId}
    />
  );
}
