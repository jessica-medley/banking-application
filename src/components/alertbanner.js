import AppContext from './app-context';

export default function AlertBanner() {
  return (
    <AppContext.Consumer>
      {({ alertMessage }) =>
        alertMessage && (
          <div className="alert alert-warning" role="alert">
            {alertMessage}
          </div>
        )
      }
    </AppContext.Consumer>
  );
}
