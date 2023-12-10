class UserAccount {
  constructor(
    _id,
    _userName,
    _password,
    _avatar,
    _roleId,
    _memberShipId,
    _rewardPoint,
    _accessToken
  ) {
    this.id = _id;
    this.userName = _userName;
    this.password = _password;
    this.avatar = _avatar;
    this.roleId = _roleId;
    this.memberShipId = _memberShipId;
    this.rewardPoint = _rewardPoint;
    this.accessToken = _accessToken;
  }
}
export default UserAccount;
