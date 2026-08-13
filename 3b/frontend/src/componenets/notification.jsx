import "../index.css";

const Notification = ({ message, isError }) => {
  if (message === null || message === "") {
    return null;
  } else {
    if (isError) {
      return (
        <div className="notificationErrorContainer">
          <p className="notificationErrorText">{message}</p>
        </div>
      );
    } else {
      return (
        <div className="notificationContainer">
          <p className="notificationText">{message}</p>
        </div>
      );
    }
  }
};

export default Notification;
