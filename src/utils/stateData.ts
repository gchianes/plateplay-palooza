
export interface StateData {
  id: string;
  name: string;
  abbreviation: string;
  spotted: boolean;
  points: number;
  path?: string;
}

export const states: StateData[] = [
  // US States (1 point each)
  { id: "AL", name: "Alabama", abbreviation: "AL", spotted: false, points: 1 },
  { id: "AK", name: "Alaska", abbreviation: "AK", spotted: false, points: 1 },
  { id: "AZ", name: "Arizona", abbreviation: "AZ", spotted: false, points: 1 },
  { id: "AR", name: "Arkansas", abbreviation: "AR", spotted: false, points: 1 },
  { id: "CA", name: "California", abbreviation: "CA", spotted: false, points: 1 },
  { id: "CO", name: "Colorado", abbreviation: "CO", spotted: false, points: 1 },
  { id: "CT", name: "Connecticut", abbreviation: "CT", spotted: false, points: 1 },
  { id: "DE", name: "Delaware", abbreviation: "DE", spotted: false, points: 1 },
  { id: "FL", name: "Florida", abbreviation: "FL", spotted: false, points: 1 },
  { id: "GA", name: "Georgia", abbreviation: "GA", spotted: false, points: 1 },
  { id: "HI", name: "Hawaii", abbreviation: "HI", spotted: false, points: 1 },
  { id: "ID", name: "Idaho", abbreviation: "ID", spotted: false, points: 1 },
  { id: "IL", name: "Illinois", abbreviation: "IL", spotted: false, points: 1 },
  { id: "IN", name: "Indiana", abbreviation: "IN", spotted: false, points: 1 },
  { id: "IA", name: "Iowa", abbreviation: "IA", spotted: false, points: 1 },
  { id: "KS", name: "Kansas", abbreviation: "KS", spotted: false, points: 1 },
  { id: "KY", name: "Kentucky", abbreviation: "KY", spotted: false, points: 1 },
  { id: "LA", name: "Louisiana", abbreviation: "LA", spotted: false, points: 1 },
  { id: "ME", name: "Maine", abbreviation: "ME", spotted: false, points: 1 },
  { id: "MD", name: "Maryland", abbreviation: "MD", spotted: false, points: 1 },
  { id: "MA", name: "Massachusetts", abbreviation: "MA", spotted: false, points: 1 },
  { id: "MI", name: "Michigan", abbreviation: "MI", spotted: false, points: 1 },
  { id: "MN", name: "Minnesota", abbreviation: "MN", spotted: false, points: 1 },
  { id: "MS", name: "Mississippi", abbreviation: "MS", spotted: false, points: 1 },
  { id: "MO", name: "Missouri", abbreviation: "MO", spotted: false, points: 1 },
  { id: "MT", name: "Montana", abbreviation: "MT", spotted: false, points: 1 },
  { id: "NE", name: "Nebraska", abbreviation: "NE", spotted: false, points: 1 },
  { id: "NV", name: "Nevada", abbreviation: "NV", spotted: false, points: 1 },
  { id: "NH", name: "New Hampshire", abbreviation: "NH", spotted: false, points: 1 },
  { id: "NJ", name: "New Jersey", abbreviation: "NJ", spotted: false, points: 1 },
  { id: "NM", name: "New Mexico", abbreviation: "NM", spotted: false, points: 1 },
  { id: "NY", name: "New York", abbreviation: "NY", spotted: false, points: 1 },
  { id: "NC", name: "North Carolina", abbreviation: "NC", spotted: false, points: 1 },
  { id: "ND", name: "North Dakota", abbreviation: "ND", spotted: false, points: 1 },
  { id: "OH", name: "Ohio", abbreviation: "OH", spotted: false, points: 1 },
  { id: "OK", name: "Oklahoma", abbreviation: "OK", spotted: false, points: 1 },
  { id: "OR", name: "Oregon", abbreviation: "OR", spotted: false, points: 1 },
  { id: "PA", name: "Pennsylvania", abbreviation: "PA", spotted: false, points: 1 },
  { id: "RI", name: "Rhode Island", abbreviation: "RI", spotted: false, points: 1 },
  { id: "SC", name: "South Carolina", abbreviation: "SC", spotted: false, points: 1 },
  { id: "SD", name: "South Dakota", abbreviation: "SD", spotted: false, points: 1 },
  { id: "TN", name: "Tennessee", abbreviation: "TN", spotted: false, points: 1 },
  { id: "TX", name: "Texas", abbreviation: "TX", spotted: false, points: 1 },
  { id: "UT", name: "Utah", abbreviation: "UT", spotted: false, points: 1 },
  { id: "VT", name: "Vermont", abbreviation: "VT", spotted: false, points: 1 },
  { id: "VA", name: "Virginia", abbreviation: "VA", spotted: false, points: 1 },
  { id: "WA", name: "Washington", abbreviation: "WA", spotted: false, points: 1 },
  { id: "WV", name: "West Virginia", abbreviation: "WV", spotted: false, points: 1 },
  { id: "WI", name: "Wisconsin", abbreviation: "WI", spotted: false, points: 1 },
  { id: "WY", name: "Wyoming", abbreviation: "WY", spotted: false, points: 1 },
  { id: "DC", name: "Washington DC", abbreviation: "DC", spotted: false, points: 1 },
  
  // Canadian Provinces (2 points each) - Updated with correct 3-letter abbreviations
  { id: "ALB", name: "Alberta", abbreviation: "ALB", spotted: false, points: 2 },
  { id: "BCO", name: "British Columbia", abbreviation: "BCO", spotted: false, points: 2 },
  { id: "MAN", name: "Manitoba", abbreviation: "MAN", spotted: false, points: 2 },
  { id: "NBR", name: "New Brunswick", abbreviation: "NBR", spotted: false, points: 2 },
  { id: "NFL", name: "Newfoundland and Labrador", abbreviation: "NFL", spotted: false, points: 2 },
  { id: "NSC", name: "Nova Scotia", abbreviation: "NSC", spotted: false, points: 2 },
  { id: "ONT", name: "Ontario", abbreviation: "ONT", spotted: false, points: 2 },
  { id: "PEI", name: "Prince Edward Island", abbreviation: "PEI", spotted: false, points: 2 },
  { id: "QUE", name: "Quebec", abbreviation: "QUE", spotted: false, points: 2 },
  { id: "SAS", name: "Saskatchewan", abbreviation: "SAS", spotted: false, points: 2 },
  { id: "YUK", name: "Yukon", abbreviation: "YUK", spotted: false, points: 2 },
  { id: "NWT", name: "Northwest Territories", abbreviation: "NWT", spotted: false, points: 2 },
  { id: "NUN", name: "Nunavut", abbreviation: "NUN", spotted: false, points: 2 }
];

export const calculateScore = (spottedStates: StateData[]): number => {
  return spottedStates.reduce((total, state) => {
    const stateData = states.find(s => s.id === state.id);
    return total + (stateData?.points || 1);
  }, 0);
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
