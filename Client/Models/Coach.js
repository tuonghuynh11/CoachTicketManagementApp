class Coach {
  constructor(
    _id,
    _coachNumber,
    _image,
    _coachType,
    _capacity,
    _status,
    _lat,
    _lng
  ) {
    this.id = _id;
    this.coachNumber = _coachNumber;
    this.image = _image;
    this.CoachType = _coachType;
    this.capacity = _capacity;
    this.status = _status;
    this.lat = _lat;
    this.lng = _lng;
  }
}
export default Coach;
