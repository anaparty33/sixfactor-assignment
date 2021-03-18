import React from 'react';
import { APP_TITLE } from 'constants/Constants';
import 'header/header.scss';
import UserInfo from 'header/user-info/userInfo';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import DashboardService from 'services/dashboardService';
import MenuPopover from 'common/menu-popover/menu-popover';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  popoverOpen = () => {

  }
  getMenuOptions = () => {
    let menuOption = [
      {
        label: 'Home',
        type: 'link',
        className: 'home',
        url: '/manage',
        isExternalUrl: false
      }
    ];
    const dashboardData = DashboardService.getDashboardDetails(this.props.userInfo.user);
    dashboardData.forEach(items => {
      menuOption = [...menuOption, {
        label: null,
        type: 'divider',
        className: 'divider'
      }, {
        label: items.title,
        type: 'label',
        className: 'group-title'
      }];
      items.cardList.forEach((option) => {
          menuOption = [...menuOption, {
            label: option.menuOptionLabel ? option.menuOptionLabel : option.label,
            type: 'link',
            className: '',
            url: option.url,
            hidden: !option.visibleOnDashboard,
            isExternalUrl: option.isExternalUrl,
            disabled: !option.isViewPermission
          }];
      })
    });
    return menuOption;
  }
  render() {
    const user = this.props.userInfo.user;
    return (
      <>
        <nav className="section__global-nav">
          <ul>
            <li className="section__global-nav__nav-item">
              <Link className="section__nav-item__nav-item-link" to="/manage">
                {APP_TITLE}
              </Link>
            </li>
            <li className="section__global-nav__nav-item">
              <a id="header-menu" className="nav-item-link">
                <svg viewBox="0 0 233.30078125 159.98291015625" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1 0 0 1 53.564216308593814 115.221435546875)">
                    <path d="M 17.4805 -52.7832 L 108.691 -52.7832 C 111.475 -52.7832 113.721 -55.127 113.721 -57.9102 C 113.721 -60.7422 111.523 -63.0371 108.691 -63.0371 L 17.4805 -63.0371 C 14.6484 -63.0371 12.4512 -60.6934 12.4512 -57.9102 C 12.4512 -55.1758 14.6973 -52.7832 17.4805 -52.7832 Z M 17.4805 -30.0781 L 108.691 -30.0781 C 111.475 -30.0781 113.721 -32.4219 113.721 -35.2051 C 113.721 -38.0371 111.523 -40.332 108.691 -40.332 L 17.4805 -40.332 C 14.6484 -40.332 12.4512 -37.9883 12.4512 -35.2051 C 12.4512 -32.4707 14.6973 -30.0781 17.4805 -30.0781 Z M 17.4805 -7.32422 L 108.691 -7.32422 C 111.475 -7.32422 113.721 -9.7168 113.721 -12.5 C 113.721 -15.332 111.523 -17.627 108.691 -17.627 L 17.4805 -17.627 C 14.6484 -17.627 12.4512 -15.2832 12.4512 -12.5 C 12.4512 -9.76562 14.6973 -7.32422 17.4805 -7.32422 Z" />
                  </g>
                </svg>
              </a>
              {user.permissions ?
                <MenuPopover className="navigation-menu" menuOption={this.getMenuOptions()} targetId={`header-menu`} popoverOpen={this.popoverOpen} />
                : ''}
            </li>
          </ul>
          <ul>
            <li className="section__global-nav__nav-item">
              <UserInfo />
            </li>
          </ul>
        </nav>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo
  };
};
export default connect(mapStateToProps)(Header);
