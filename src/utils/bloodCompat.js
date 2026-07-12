export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Which donor groups can safely give to a given recipient (patient).
// Mirrors the backend `compatible_donor_types` RPC.
const CAN_RECEIVE_FROM = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

export function compatibleDonorsFor(recipient) {
  return CAN_RECEIVE_FROM[recipient] ?? [];
}

export function canDonate(donorGroup, recipientGroup) {
  if (!donorGroup) return false;
  return compatibleDonorsFor(recipientGroup).includes(donorGroup);
}
