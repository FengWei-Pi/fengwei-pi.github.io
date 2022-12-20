// Set markdown file contents to string for typescript
declare module "*.md" {
  const content: string;
  export default content;
}
