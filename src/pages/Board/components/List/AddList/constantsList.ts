interface ListVars {
  nameRunButton: string;
  bgRunButton: string;
  timeOut: NodeJS.Timeout | null | undefined;
}
const listVars: ListVars = {
  nameRunButton: '',
  bgRunButton: '',
  timeOut: null,
};
export default listVars;
