CREATE TABLE public.christmas_looks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_description text NOT NULL DEFAULT '',
  long_description text,
  palette jsonb NOT NULL DEFAULT '[]'::jsonb,
  key_elements text[] NOT NULL DEFAULT '{}',
  categories text[] NOT NULL DEFAULT '{}',
  hero_image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.christmas_looks TO anon;
GRANT SELECT ON public.christmas_looks TO authenticated;
GRANT ALL ON public.christmas_looks TO service_role;
ALTER TABLE public.christmas_looks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active christmas looks are public" ON public.christmas_looks FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage christmas looks" ON public.christmas_looks FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER christmas_looks_updated_at BEFORE UPDATE ON public.christmas_looks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.decor_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  retailer text NOT NULL DEFAULT '',
  description text,
  image_url text,
  price numeric,
  previous_price numeric,
  currency text NOT NULL DEFAULT 'GBP',
  product_url text,
  affiliate_url text,
  affiliate_network text,
  is_sponsored boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  is_available boolean NOT NULL DEFAULT true,
  last_checked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.decor_products TO anon;
GRANT SELECT ON public.decor_products TO authenticated;
GRANT ALL ON public.decor_products TO service_role;
ALTER TABLE public.decor_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Available decor products are public" ON public.decor_products FOR SELECT USING (is_available = true);
CREATE POLICY "Admins manage decor products" ON public.decor_products FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER decor_products_updated_at BEFORE UPDATE ON public.decor_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.look_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  look_id uuid NOT NULL REFERENCES public.christmas_looks(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.decor_products(id) ON DELETE CASCADE,
  category text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (look_id, product_id, category)
);
CREATE INDEX look_products_look_idx ON public.look_products (look_id, category, sort_order);
GRANT SELECT ON public.look_products TO anon;
GRANT SELECT ON public.look_products TO authenticated;
GRANT ALL ON public.look_products TO service_role;
ALTER TABLE public.look_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Look products are public" ON public.look_products FOR SELECT USING (true);
CREATE POLICY "Admins manage look products" ON public.look_products FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

INSERT INTO public.christmas_looks (slug, name, short_description, long_description, palette, key_elements, categories, sort_order) VALUES
('traditional-red-gold','Traditional Red & Gold','Deep red velvet, warm gold and candlelight — the Christmas everybody pictures.','The classic British Christmas: a full green tree ribboned in red velvet, gold baubles catching firelight, garlanded mantel and candles everywhere.','[{"name":"Deep Red","hex":"#8E1B24"},{"name":"Antique Gold","hex":"#C9A227"},{"name":"Forest Green","hex":"#1F4033"},{"name":"Warm Cream","hex":"#F6EFE2"}]'::jsonb,ARRAY['A full, deep-green tree','Wide red velvet ribbon woven top to bottom','Gold and burgundy baubles in three sizes','Warm-white lights, never cool white','A garlanded mantel with real candles']::text[],ARRAY['tree','tree-decorations','baubles','ribbon-garland','tree-topper','lights','stockings','mantel','wreath','table']::text[],1),
('elegant-gold-champagne','Elegant Gold & Champagne','Soft champagne, brushed gold and glass — quietly glamorous and grown-up.','A restrained, luxurious look built from one metallic family: champagne, pale gold and clear glass, with no competing colour.','[{"name":"Champagne","hex":"#E7D4B0"},{"name":"Brushed Gold","hex":"#C8A96A"},{"name":"Pearl","hex":"#F3EDE3"},{"name":"Soft Taupe","hex":"#B9A894"}]'::jsonb,ARRAY['A slim tree in one metallic family','Glass and matt champagne baubles','Sheer gold organza ribbon','Candlelight in clear glass holders','A simple gold star or bow topper']::text[],ARRAY['tree','baubles','ribbon-garland','tree-topper','lights','table','cushions','finishing-touches']::text[],2),
('winter-wonderland','Winter Wonderland','Icy white, silver and crystal, as though snow settled indoors.','Frosted branches, silver glass and crystal drops with cool sparkle and plenty of white space.','[{"name":"Snow White","hex":"#FFFFFF"},{"name":"Silver","hex":"#C6CBD1"},{"name":"Ice Blue","hex":"#CFE2EC"},{"name":"Crystal","hex":"#EAF2F6"}]'::jsonb,ARRAY['A flocked or frosted tree','Silver and crystal drop ornaments','Iced branches and faux snow','Twinkling warm-white or ice-white lights','White faux fur under the tree']::text[],ARRAY['tree','tree-decorations','baubles','tree-topper','lights','wreath','table','cushions']::text[],3),
('nordic-christmas','Nordic Christmas','Pale wood, white linen and simple wooden shapes — calm and uncluttered.','Scandi restraint: bare wood, white linen, tiny wooden ornaments and one string of warm lights.','[{"name":"Chalk White","hex":"#F7F5F0"},{"name":"Pale Wood","hex":"#D8C3A5"},{"name":"Soft Grey","hex":"#B7B3AC"},{"name":"Muted Sage","hex":"#9BAA9A"}]'::jsonb,ARRAY['A slim natural tree with space between branches','Small wooden and felt ornaments','Plain white linen and paper stars','One string of warm lights, nothing more','A simple straw or wooden star topper']::text[],ARRAY['tree','tree-decorations','tree-topper','lights','wreath','table','cushions','finishing-touches']::text[],4),
('natural-woodland','Natural Woodland','Foraged greenery, dried oranges, pinecones and hessian.','Everything from the garden and the fruit bowl: eucalyptus, pinecones, cinnamon, dried orange slices and brown paper.','[{"name":"Deep Green","hex":"#2F4A36"},{"name":"Bark Brown","hex":"#6B4E36"},{"name":"Dried Orange","hex":"#C4783A"},{"name":"Hessian","hex":"#D9C8AA"}]'::jsonb,ARRAY['Real or realistic greenery garlands','Dried orange slices and cinnamon bundles','Pinecones, berries and hessian ribbon','Brown paper and twine wrapping','Beeswax candles']::text[],ARRAY['tree','tree-decorations','ribbon-garland','wreath','mantel','table','finishing-touches']::text[],5),
('classic-green-tartan','Classic Green & Tartan','Green, tartan ribbon and brass — a country-house Christmas.','Rich green with tartan ribbon, brass and leather details; cosy, traditional and beautifully British.','[{"name":"Hunter Green","hex":"#26402E"},{"name":"Tartan Red","hex":"#9B2A2A"},{"name":"Brass","hex":"#B98B34"},{"name":"Cream","hex":"#F1E8D8"}]'::jsonb,ARRAY['Tartan ribbon on the tree and stair','Green garlands with brass accents','Checked stockings on the mantel','Warm lights and plenty of candles','Tartan throws over the sofa']::text[],ARRAY['tree','ribbon-garland','baubles','stockings','mantel','wreath','table','cushions']::text[],6),
('candy-cane-christmas','Candy Cane Christmas','Red-and-white stripes, sweets and joyful nostalgia.','Playful stripes, peppermint and gingham — a happy, sweet-shop Christmas children adore.','[{"name":"Candy Red","hex":"#D02B2B"},{"name":"Snow White","hex":"#FFFFFF"},{"name":"Peppermint Pink","hex":"#F0B6BE"},{"name":"Mint","hex":"#BEE0D2"}]'::jsonb,ARRAY['Striped ribbon in red and white','Candy cane and sweet-shaped ornaments','Red gingham stockings','Bright warm lights','A striped tree skirt']::text[],ARRAY['tree','tree-decorations','baubles','ribbon-garland','stockings','lights','finishing-touches']::text[],7),
('vintage-christmas','Vintage Christmas','Faded glass, bottle brush trees and heirloom decorations.','Nostalgic and collected: mercury glass, old-fashioned baubles, paper garlands and things handed down.','[{"name":"Faded Red","hex":"#A34B44"},{"name":"Antique Gold","hex":"#C2A05A"},{"name":"Sage","hex":"#9DA88E"},{"name":"Aged Ivory","hex":"#EFE4CE"}]'::jsonb,ARRAY['Mercury glass and heirloom baubles','Bottle brush trees on the mantel','Paper chains and vintage postcards','Old-fashioned coloured lights','Mismatched decorations with a story']::text[],ARRAY['tree','tree-decorations','baubles','lights','mantel','finishing-touches']::text[],8),
('luxury-christmas','Luxury Christmas','Velvet, crystal and jewel colours — full-drama hotel-lobby Christmas.','Deep emerald and plum velvet, crystal, oversized bows and abundance everywhere.','[{"name":"Emerald","hex":"#12503F"},{"name":"Plum","hex":"#5B2545"},{"name":"Crystal Gold","hex":"#D3B160"},{"name":"Midnight","hex":"#161B33"}]'::jsonb,ARRAY['An abundantly filled tree','Oversized velvet bows','Crystal and jewel-toned glass','Layered garlands and heavy ribbon','Statement centrepiece on the table']::text[],ARRAY['tree','tree-decorations','baubles','ribbon-garland','tree-topper','lights','mantel','wreath','table','cushions']::text[],9),
('colourful-family-christmas','Colourful Family Christmas','Every colour, every handmade decoration, all the noise and joy.','The tree the whole family decorates: multicoloured lights, handmade ornaments and nothing matching on purpose.','[{"name":"Bright Red","hex":"#D3382F"},{"name":"Cobalt","hex":"#2F5BAA"},{"name":"Sunshine","hex":"#E8B93C"},{"name":"Grass Green","hex":"#3F8F4A"}]'::jsonb,ARRAY['Multicoloured fairy lights','Handmade and school-made ornaments','A tin of mismatched baubles','Named stockings for everyone','Paper chains made together']::text[],ARRAY['tree','tree-decorations','baubles','lights','stockings','finishing-touches']::text[],10),
('a-white-christmas','A White Christmas','White on white on white, with texture doing all the work.','A calm, all-white scheme where linen, wool, ceramic and matt glass create the interest instead of colour.','[{"name":"Pure White","hex":"#FFFFFF"},{"name":"Warm Chalk","hex":"#F4F0E9"},{"name":"Soft Stone","hex":"#DCD6CC"},{"name":"Pale Silver","hex":"#CFD3D6"}]'::jsonb,ARRAY['A white or heavily flocked tree','Matt white and pearl baubles','White knitted stockings and throws','Warm-white lights only','White ceramic and candlelight on the table']::text[],ARRAY['tree','baubles','tree-topper','lights','stockings','table','cushions']::text[],11),
('latest-trends','Latest Trends','This year''s looks — oversized bows, cherry red and sculptural greenery.','The styles everyone is decorating with right now, gathered in one place and updated each season.','[{"name":"Cherry Red","hex":"#B32134"},{"name":"Butter","hex":"#EFD9A6"},{"name":"Chocolate","hex":"#4A342A"},{"name":"Warm White","hex":"#F7F1E6"}]'::jsonb,ARRAY['Oversized fabric bows instead of baubles','Cherry red with chocolate brown','Sculptural, sparse greenery','Mixed metals rather than one','Ribbon cascading from the tree top']::text[],ARRAY['tree','tree-decorations','ribbon-garland','tree-topper','wreath','table','finishing-touches']::text[],12);