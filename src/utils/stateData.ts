export interface StateData {
  id: string;
  name: string;
  abbreviation: string;
  spotted: boolean;
  path?: string;
}

export const states: StateData[] = [
  { id: "AL", name: "Alabama", abbreviation: "AL", spotted: false },
  { id: "AK", name: "Alaska", abbreviation: "AK", spotted: false },
  { id: "AZ", name: "Arizona", abbreviation: "AZ", spotted: false },
  { id: "AR", name: "Arkansas", abbreviation: "AR", spotted: false },
  { id: "CA", name: "California", abbreviation: "CA", spotted: false },
  { id: "CO", name: "Colorado", abbreviation: "CO", spotted: false },
  { id: "CT", name: "Connecticut", abbreviation: "CT", spotted: false },
  { id: "DE", name: "Delaware", abbreviation: "DE", spotted: false },
  { id: "FL", name: "Florida", abbreviation: "FL", spotted: false },
  { id: "GA", name: "Georgia", abbreviation: "GA", spotted: false },
  { id: "HI", name: "Hawaii", abbreviation: "HI", spotted: false },
  { id: "ID", name: "Idaho", abbreviation: "ID", spotted: false },
  { id: "IL", name: "Illinois", abbreviation: "IL", spotted: false },
  { id: "IN", name: "Indiana", abbreviation: "IN", spotted: false },
  { id: "IA", name: "Iowa", abbreviation: "IA", spotted: false },
  { id: "KS", name: "Kansas", abbreviation: "KS", spotted: false },
  { id: "KY", name: "Kentucky", abbreviation: "KY", spotted: false },
  { id: "LA", name: "Louisiana", abbreviation: "LA", spotted: false },
  { id: "ME", name: "Maine", abbreviation: "ME", spotted: false },
  { id: "MD", name: "Maryland", abbreviation: "MD", spotted: false },
  { id: "MA", name: "Massachusetts", abbreviation: "MA", spotted: false },
  { id: "MI", name: "Michigan", abbreviation: "MI", spotted: false },
  { id: "MN", name: "Minnesota", abbreviation: "MN", spotted: false },
  { id: "MS", name: "Mississippi", abbreviation: "MS", spotted: false },
  { id: "MO", name: "Missouri", abbreviation: "MO", spotted: false },
  { id: "MT", name: "Montana", abbreviation: "MT", spotted: false },
  { id: "NE", name: "Nebraska", abbreviation: "NE", spotted: false },
  { id: "NV", name: "Nevada", abbreviation: "NV", spotted: false },
  { id: "NH", name: "New Hampshire", abbreviation: "NH", spotted: false },
  { id: "NJ", name: "New Jersey", abbreviation: "NJ", spotted: false },
  { id: "NM", name: "New Mexico", abbreviation: "NM", spotted: false },
  { id: "NY", name: "New York", abbreviation: "NY", spotted: false },
  { id: "NC", name: "North Carolina", abbreviation: "NC", spotted: false },
  { id: "ND", name: "North Dakota", abbreviation: "ND", spotted: false },
  { id: "OH", name: "Ohio", abbreviation: "OH", spotted: false },
  { id: "OK", name: "Oklahoma", abbreviation: "OK", spotted: false },
  { id: "OR", name: "Oregon", abbreviation: "OR", spotted: false },
  { id: "PA", name: "Pennsylvania", abbreviation: "PA", spotted: false },
  { id: "RI", name: "Rhode Island", abbreviation: "RI", spotted: false },
  { id: "SC", name: "South Carolina", abbreviation: "SC", spotted: false },
  { id: "SD", name: "South Dakota", abbreviation: "SD", spotted: false },
  { id: "TN", name: "Tennessee", abbreviation: "TN", spotted: false },
  { id: "TX", name: "Texas", abbreviation: "TX", spotted: false },
  { id: "UT", name: "Utah", abbreviation: "UT", spotted: false },
  { id: "VT", name: "Vermont", abbreviation: "VT", spotted: false },
  { id: "VA", name: "Virginia", abbreviation: "VA", spotted: false },
  { id: "WA", name: "Washington", abbreviation: "WA", spotted: false },
  { id: "WV", name: "West Virginia", abbreviation: "WV", spotted: false },
  { id: "WI", name: "Wisconsin", abbreviation: "WI", spotted: false },
  { id: "WY", name: "Wyoming", abbreviation: "WY", spotted: false },
  { id: "DC", name: "Washington DC", abbreviation: "DC", spotted: false }
];

export const calculateScore = (spottedStates: StateData[]): number => {
  return spottedStates.length;
};

export const getProgress = (spottedStates: StateData[]): number => {
  return (spottedStates.length / states.length) * 100;
};

export const sortStatesBySpotted = (statesList: StateData[]): StateData[] => {
  return [...statesList].sort((a, b) => {
    if (a.spotted && !b.spotted) return -1;
    if (!a.spotted && b.spotted) return 1;
    return a.name.localeCompare(b.name);
  });
};

export const findStateByAbbreviation = (abbreviation: string): StateData | undefined => {
  return states.find(state => state.abbreviation === abbreviation);
};

export const getSpottedStates = (): StateData[] => {
  return states.filter(state => state.spotted);
};
