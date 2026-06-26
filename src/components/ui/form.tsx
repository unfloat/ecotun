/**
 * Form component — re-exports the Field primitives from this shadcn v4
 * (base-nova / @base-ui/react) installation.
 *
 * In shadcn v4 the traditional react-hook-form wrapper ("Form") has been
 * superseded by the Field component family. This barrel re-exports those
 * primitives under the "form" path so that imports like
 * `import { … } from "@/components/ui/form"` continue to work.
 */
export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "@/components/ui/field"
