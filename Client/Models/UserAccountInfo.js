import UserAccount from "./UserAccount";

class UserAccountInfo {
  constructor(
    _id,
    _fullName,
    _email,
    _address,
    _phoneNumber,
    _userId,
    _gender,
    _UserAccountData
  ) {
    this.id = _id;
    this.fullName = _fullName;
    this.address = _address;
    this.email = _email;
    this.phoneNumber = _phoneNumber;
    this.userId = _userId;
    this.gender = _gender;

    this.UserAccountData = new UserAccount(
      _id,
      _UserAccountData.userName,
      "fdafadfdfdfadfadad",
      _UserAccountData.avatar,
      _UserAccountData.roleId,
      _UserAccountData.memberShipId,
      _UserAccountData.rewardPoint
    );
  }
}
export default UserAccountInfo;
