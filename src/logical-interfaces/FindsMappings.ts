export default interface FindsMappings<From> {
  getMappings(
    variables: string[],
    from: From,
    truth?: true | false
  ): Iterator<{ [variable: string]: string }>;
}
