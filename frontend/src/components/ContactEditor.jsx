function ContactEditor({ contact, onChange }) {
  const update = (field, value) => onChange({ ...contact, [field]: value });

  return (
    <div style={{ marginBottom: '20px' }}>
      <label>Contact</label>
      <input
        placeholder="Email address"
        type="email"
        value={contact.email || ''}
        onChange={(e) => update('email', e.target.value)}
      />
      <input
        placeholder="Phone number"
        type="tel"
        value={contact.phone || ''}
        onChange={(e) => update('phone', e.target.value)}
      />
      <input
        placeholder="LinkedIn profile URL"
        type="url"
        value={contact.linkedin || ''}
        onChange={(e) => update('linkedin', e.target.value)}
      />
      <input
        placeholder="GitHub profile URL"
        type="url"
        value={contact.github || ''}
        onChange={(e) => update('github', e.target.value)}
      />
    </div>
  );
}

export default ContactEditor;
