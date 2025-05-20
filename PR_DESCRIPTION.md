# Add enhanced 'No challenges found' UI with icon and clear filters button

## Changes

- Added an enhanced UI for when no challenges are found after applying filters
- Added a circular background with the Challenge icon
- Added a descriptive message explaining that no challenges match the current filters
- Added a 'Clear Filters' button that resets all filter selections
- Improved styling with shadow, rounded corners, and hover effects

## Implementation Details

- Used the existing ChallengeIcon component from the Icones.tsx file
- Added conditional rendering to show the "No challenges found" UI when filteredChallenges is empty
- Added a "Clear Filters" button that resets both selectedChallengeTypes and selectedDifficulty arrays
- Enhanced the UI with a circular background for the icon, proper spacing, and hover effects

## Testing

The changes have been tested locally and work as expected. When no challenges match the applied filters, the enhanced UI is displayed with the following features:
- A target icon in a light blue circular background
- A clear heading "No challenges found"
- A descriptive message explaining why no challenges are shown
- A "Clear Filters" button that resets all filters when clicked

This PR addresses the need for better user feedback when no challenges match the applied filters, making the UI more user-friendly and intuitive.