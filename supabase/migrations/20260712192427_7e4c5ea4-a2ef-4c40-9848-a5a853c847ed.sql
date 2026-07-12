
drop policy "Anyone can join waitlist" on public.waitlist;

create policy "Anyone can join waitlist"
  on public.waitlist for insert
  to anon, authenticated
  with check (
    length(email) between 5 and 255
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and (name is null or length(name) <= 80)
    and (postcode is null or length(postcode) <= 12)
    and (source is null or length(source) <= 60)
  );

drop policy "Anyone can submit partner enquiry" on public.partner_enquiries;

create policy "Anyone can submit partner enquiry"
  on public.partner_enquiries for insert
  to anon, authenticated
  with check (
    length(company) between 1 and 120
    and length(contact_name) between 1 and 80
    and length(email) between 5 and 255
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and (website is null or length(website) <= 255)
    and (budget is null or length(budget) <= 60)
    and (message is null or length(message) <= 2000)
  );
