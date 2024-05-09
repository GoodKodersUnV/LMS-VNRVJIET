export default function TableOfUsers({ props }: { props: any }) {
    return (
      <div className="p-5 m-3 flex justify-center items-center">
        <table className="border-collapse border">
          <thead>
            <tr>
              <th className="p-3 border">S.no</th>
              <th className="p-3 border">Username</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {props.map((user: any, index: number) => (
              <tr key={user.id}>
                <td className="p-3 border">{index + 1}</td>
                <td className="p-3 border">
                  <div className="flex items-center justify-start">
                    {user.image ? (
                      <img src={user.image} alt="User" className="rounded-full w-10 h-10" />
                    ) : (
                      <img src={'/images/placeholder.jpg'} alt="User" className="rounded-full w-10 h-10" />
                    )}
                    <span className="ml-2">{user.username}</span>
                  </div>
                </td>
                <td className="p-3 border">{user.name}</td>
                <td className="p-3 border">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  