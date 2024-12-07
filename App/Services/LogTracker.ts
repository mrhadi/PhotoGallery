export const logError = (error: string) => {
  console.error('logError:', error, logError.caller);
};

export const logCritical = (error: any) => {
  console.error('logCritical:', error);
};

export const captureException = (error: any) => {
  console.error('captureException:', error, captureException.caller);
};

export const logAPIError = (error: any) => {
  console.error('logAPIError:', error);
};

export const logConsole = (log: any) => {
  console.log('logConsole:', log);
}
