// Illustrations of the Mirall Console, built in HTML until captures exist. The
// column headings, setting labels and states are the Console's own (/app/licenses,
// /app/instances, the configuration catalog); the people and machines are the same
// fictional studio as the app screenshots. Hidden from assistive tech: the card's
// copy says what each one shows, and a table of made-up rows read aloud is noise.

function Pill({ tone, children }: { tone?: 'warn' | 'mute'; children: string }) {
  return <span className={`st-pill${tone ? ` st-${tone}` : ''}`}>{children}</span>
}

export function LicensesPanel() {
  return (
    <div className="st-cui" aria-hidden="true">
      <div className="st-cui-scroll">
        <table>
          <thead><tr><th>Key</th><th>Person</th><th>Profile</th><th>Status</th><th>Computers</th></tr></thead>
          <tbody>
            <tr><td>MRL-7QK2E-•••••</td><td>Lena Vogt</td><td>Edit suites</td><td><Pill>Active</Pill></td><td>2</td></tr>
            <tr><td>MRL-B8MND-•••••</td><td>Jonas Reiter</td><td>VFX</td><td><Pill>Active</Pill></td><td>3</td></tr>
            <tr><td>MRL-5VZGP-•••••</td><td>Freelance colourist</td><td>Freelancers</td><td><Pill tone="warn">Suspended</Pill></td><td>1</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Setting({ name, value, notes }: { name: string; value: string; notes: string[] }) {
  return (
    <div className="st-setting">
      <b>{name}</b>
      <span className="st-v">{value}</span>
      <span className="st-d">{notes.map((n) => <span key={n}>{n}</span>)}</span>
    </div>
  )
}

export function ProfilePanel() {
  return (
    <div className="st-cui" aria-hidden="true">
      <div className="st-cui-head">Edit suites <span>v7 · Live</span></div>
      <Setting name="Relay" value="Automatic" notes={['When a direct connection fails', 'Locked on every install']} />
      <Setting name="Record local activity" value="On" notes={['Security · can only be tightened']} />
      <Setting name="Keep activity for" value="365 days" notes={['Locked by template']} />
      <Setting name="Require a backup" value="On" notes={['Security · can only be tightened']} />
    </div>
  )
}

export function InstancesPanel() {
  return (
    <div className="st-cui" aria-hidden="true">
      <div className="st-cui-scroll">
        <table>
          <thead><tr><th>Person</th><th>Computer</th><th>Platform</th><th>Mirall</th><th>Configuration</th><th>Backup</th><th>Last seen</th></tr></thead>
          <tbody>
            <tr><td>Lena Vogt</td><td>EDIT-02</td><td>macOS 26</td><td>1.13.0</td><td><Pill>Up to date</Pill></td><td><Pill>Protected</Pill></td><td>2 min ago</td></tr>
            <tr><td>Jonas Reiter</td><td>VFX-WS-11</td><td>Windows 11</td><td>1.13.0</td><td><Pill>Up to date</Pill></td><td><Pill>Protected</Pill></td><td>Today</td></tr>
            <tr><td>Jonas Reiter</td><td>render-ln-04</td><td>Linux</td><td>1.12.2</td><td><Pill tone="warn">Behind by 1</Pill></td><td><Pill tone="warn">At risk</Pill></td><td>Yesterday</td></tr>
            <tr><td>Mara Kühn</td><td>MK-MBP</td><td>macOS 26</td><td>1.13.0</td><td><Pill>Up to date</Pill></td><td><Pill tone="mute">Not set up</Pill></td><td>3 days ago</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AuditPanel() {
  return (
    <div className="st-cui" aria-hidden="true">
      <div className="st-cui-scroll">
        <table>
          <thead><tr><th>When</th><th>Who</th><th>Action</th><th>Target</th></tr></thead>
          <tbody>
            <tr><td>10:42</td><td>A. Hartmann</td><td>Profile published</td><td>Edit suites · v7</td></tr>
            <tr><td>10:15</td><td>A. Hartmann</td><td>Key revealed</td><td>MRL-7QK2E</td></tr>
            <tr><td>09:58</td><td>—</td><td>Computer connected</td><td>VFX-WS-11</td></tr>
            <tr><td>Mon</td><td>S. Brandt</td><td>Key suspended</td><td>MRL-5VZGP</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
