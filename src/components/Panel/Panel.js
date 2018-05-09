import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Mortal from 'react-mortal';
import { Icon } from 'antd';
// import './less/panel.less';

export default class Panel extends Component {
  static defaultProps = {
    className: '',
    title: ''
  }

  getOther = (onClose, title) => (
    <div className="panel-header">
      <a
      className="panel-close"
      onClick={onClose}
      href="javascript:;"
      >
        <Icon type="right-circle-o" />
      </a>
      <div className="panel-title">
        {title}
      </div>
    </div>
  );

  render() {
    const {
      isOpened,
      onClose,
      direction,
      className,
      title,
      children,
        } = this.props;

    const vertical = (direction === 'vertical');
    const panelClassName = classnames({
      panel: true,
      'panel-vertical': vertical,
    }, className);
    const other = this.getOther(onClose, title);
    return (
      <Mortal
        isOpened={isOpened}
        onClose={onClose}
        motionStyle={(spring, isVisible) => ({
          opacity: spring(isVisible ? 1 : 0),
          panelOffsetX: spring(isVisible ? 0 : 100),
          panelOffsetY: spring(isVisible ? 0 : -100),
        })}
      >
        {(motion, isVisible) => (
          <div
            className={panelClassName}
            style={{
              pointerEvents: isVisible ? 'auto' : 'none',
            }}
          >
            <div
              className="panel-overlay"
              onClick={onClose}
              style={{
                opacity: motion.opacity,
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
            />

            <div
              className="panel-container"
              style={vertical ? {
                transform: `translate3d(0, ${motion.panelOffsetY}%, 0)`,
              } : {
                  transform: `translate3d(${motion.panelOffsetX}%, 0, 0)`,
                }}
            >
              {other}
              {children}
            </div>

          </div>
        )}
      </Mortal>
    );
  }
}
