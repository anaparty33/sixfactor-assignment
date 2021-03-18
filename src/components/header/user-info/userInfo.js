import { Icon } from '@dx/continuum-icon';
import React from 'react';
import { connect } from 'react-redux';
import { getUserProfile } from 'actions/userInfoActions';
import 'header/user-info/userInfo.scss';
import MenuPopover from 'common/menu-popover/menu-popover';
class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iconName: "chevron-down"
    };
  }
  componentDidMount() {
    /**
     * get user profile
     */
    this.props.getUserProfile();
  }
  setViewState = (state, callback) => {
    this.setState({
      ...state
    }, callback);
  };
  /**
   * toggle user popover
   */
  popoverOpen = (flag) => {
    this.setViewState({
      iconName: flag ? "chevron-up" : "chevron-down"
    });
  };
  render() {
    const { userInfo } = this.props;
    const { iconName } = this.state;
    const menuOption = [
      {
        label: `${userInfo.firstName} ${userInfo.lastName}`,
        type: 'label',
        description: 'Apple Inc.',
        className: 'user-details',
        url: null
      },
      {
        label: 'Sign out',
        type: 'logout',
        className: 'logout-button',
        url: '/auth/logout',
        isClosePopOver: true
      }
    ];
    return (
      <React.Fragment>
          <a id="user-popover" className="user-info nav-item-link">
            <span className="pr-2">{userInfo.firstName}</span>
            <Icon name={iconName} />
          </a>
          <MenuPopover className="user-info-popover" targetId={`user-popover`} menuOption={menuOption} popoverOpen={this.popoverOpen} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo.user
  };
};
const mapDispatchToProps = {
  getUserProfile
};
export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);