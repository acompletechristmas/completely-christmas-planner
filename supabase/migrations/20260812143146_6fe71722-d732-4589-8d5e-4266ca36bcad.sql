ALTER TABLE public.inspiration_products ADD COLUMN IF NOT EXISTS quantity numeric;
ALTER TABLE public.inspiration_products ADD COLUMN IF NOT EXISTS quantity_max numeric;
ALTER TABLE public.inspiration_products ADD COLUMN IF NOT EXISTS quantity_unit text;
ALTER TABLE public.inspiration_products ADD COLUMN IF NOT EXISTS size_note text;
ALTER TABLE public.inspiration_products ADD COLUMN IF NOT EXISTS colour_finish text;
ALTER TABLE public.inspiration_products ADD COLUMN IF NOT EXISTS styling_note text;
ALTER TABLE public.inspiration_products ADD COLUMN IF NOT EXISTS is_essential boolean NOT NULL DEFAULT true;
ALTER TABLE public.inspiration_products ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS inspiration_products_updated_at ON public.inspiration_products;
CREATE TRIGGER inspiration_products_updated_at BEFORE UPDATE ON public.inspiration_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();