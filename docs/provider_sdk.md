This document describes the API for data providers for HorseLink. This needs some careful thought and design, thus it is largely a placeholder for now.

# Get meetings

```ts
const meetings: Meeting[] = await hl.getMeetings();
```

## Returns

An array of `Meeting` objects representing the details of all meetings taking place in the next 24 hours.

# Get next meeting

```ts
const meeting: Meeting = await hl.getNextMeeting();
```

## Returns

A `Meeting` object representing the details of the soonest meeting.

# Get meetings for a location

# Get meetings taking place on a date

# OBJECTS AND TYPES

# Meeting Object

### id

The mnemonic identifier for the meeting.

### name

The name of the meeting.

### location

The mnemonic identifer for the location of the meeting.

### date

A date string in the format `YYYY-MM-DD` representing the regional date on which the meeting will occur.

### races

An array of `Race` objects.

# Race object

### number

The race number, eg 1.

### name

The name of the race.

### start

A timestamp representing the race start time.

### end

A timestamp representing the race end time.

### close

A timestamp representing the time at which bets will no longer be accepted.

### status

The status of the race. One of:

- "abandoned"
- "interim"
- "normal"
- "paying"
- "closed"

### results

An array of `RaceResult` objects.

## RaceResult object

TODO
