import AppContext from './app-context';

export default function AlertBanner() {
  return (
    <AppContext.Consumer>
      {({ alertObj }) =>
        alertObj && (
          <div className={`alert alert-${alertObj.bannerType || 'warning'}`} role="alert">
            {alertObj.message}
          </div>
        )
      }
    </AppContext.Consumer>
  );
}
