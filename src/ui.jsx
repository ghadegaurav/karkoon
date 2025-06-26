// {/* <div className='min-h-[100vh] w-[100vw] bg-emerald-50'>
//       <div className='flex flex-col'>

//         <div className='text-center'>
//           <h1 className='text-red-400'>Karkoon - A smart bill splitter</h1>
//           <p>Just add everything here, and you'll be good to go</p>
//         </div>

//         <div className='flex flex-row justify-around mx-10 my-5'>
//           <button onClick={addUser}>Add User</button>
//           <button onClick={() => calculate()}>Calculate</button>
//           <button onClick={clear}>Clear</button>
//         </div>

//         {/* <form action="" ref={formRef}> */}
//         <div id='resultDiv' className=''>
//           <button className="border px-4 py-2 rounded bg-white" onClick={() => setResultVisibility(prev => !prev)}>
//             {resultVisibility ? '^' : 'v'}
//           </button>
//           <div className={`grid duration-300 ease-out ${resultVisibility ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
//             <div className='overflow-hidden'>
//               {payData.some(user => user.payTo.length > 0) ? (
//                 payData.map((user, userIndex) => {
//                   return (
//                     user.payTo.length > 0 && (
//                       <div key={user.id}>
//                         <div>{userData[user.id] ? userData[user.id] : `User ${+user.id + 1}`} has to pay:</div>
//                         {user.payTo.map((receiver, recIndex) => (
//                           <p key={recIndex}>
//                             {receiver.amount} to {userData[receiver.id] ? userData[receiver.id] : `User ${+receiver.id + 1} `}
//                           </p>
//                         ))}
//                       </div>
//                     )
//                   );
//                 })
//               ) : (
//                 <p>Everything is balanced as it should be. Nobody have to pay!</p>
//               )}

//             </div>
//           </div>
//         </div>

//         <div className='border-2 border-blue-600'>
//           {
//             expenseData.map((user, index) => {
//               return (
//                 <>
//                   <button onClick={() => removeUser(user.id)}>Remove User</button>
//                   <div className='w-full p-10 rounded-2xl shadow-xl bg-white'>
//                     <div className=' flex flex-row justify-between mb-1'>
//                       <div className='flex flex-row'>
//                         {/* <div>{((name) => { const n = name.trim().split(' ').filter(Boolean); return n.length === 0 ? 'U' : n.length === 1 ? n[0][0].toUpperCase() : (n[0][0] + n[n.length - 1][0]).toUpperCase(); })(user.name)}</div> */}
//                         {userData[user.id] && <div>{getIntials(userData[user.id]) || "U"} </div>}
//                         <input type="text" name="" id="" placeholder={`Enter name for user${Number(user.id) + 1}`} className='ml-2' value={userData[user.id]} onChange={(e) => handleUserChange(index, e)} />
//                       </div>
//                       <div>{user.expenses.reduce((total, exp) => total + exp[0], 0)} </div>
//                     </div>

//                     {
//                       user.expenses.map((expense, expIndex) => {
//                         const isEveryoneSelected = expense[1].length === noOfUsers;
//                         return (
//                           <div className='flex flex-col border-2 border-pink-500'>
//                             <div className='relative flex flex-row my-2 justify-between gap-2'>
//                               <button
//                                 className='text-white bg-red-800 w-6 h-6 flex-shrink-0'
//                                 onClick={() => removeExpense(user.id, expIndex)}
//                               >
//                                 <Trash2 />
//                               </button>

//                               <input
//                                 type="text"
//                                 placeholder='Expense description (Optional)'
//                                 className='border rounded-lg pl-2 flex-1 min-w-0'
//                               />

//                               <input
//                                 type="text"
//                                 placeholder='Amount'
//                                 className='border w-20 sm:w-25 rounded-lg pl-2 flex-shrink-0'
//                                 onChange={(e) => handleExpenseAmountChange(index, expIndex, e.target.value)}
//                               />

//                               <div className='flex flex-shrink-0 min-w-0'>
//                                 <div className='flex flex-row items-center min-w-0'>
//                                   <div className='whitespace-nowrap text-sm sm:text-base mr-2 hidden sm:block'>Split with:</div>
//                                   <div className='whitespace-nowrap text-xs mr-1 sm:hidden'>Split:</div>

//                                   <div className='flex items-center min-w-0'>
//                                     {expense[1].length == 0 ? (
//                                       <div className='text-xs sm:text-sm'>
//                                         No-one
//                                         <p className='text-xs hidden sm:block'>(will not be considered for calculations)</p>
//                                       </div>
//                                     ) : (
//                                       <div className='flex items-center'>
//                                         {expense[1].slice(0, 3).map((splitUser, expUserIndex) => {
//                                           return (
//                                             <div
//                                               key={splitUser}
//                                               className='border-indigo-950 border shadow-lg rounded-full w-8 h-8 sm:w-11 sm:h-11 text-center text-indigo-950 flex items-center justify-center font-semibold text-xs sm:text-lg bg-blue-100 flex-shrink-0'
//                                               style={{
//                                                 marginLeft: expUserIndex > 0 ? '-10px' : '0',
//                                                 zIndex: 3 - expUserIndex,
//                                               }}
//                                             >
//                                               {userData[splitUser] ? getIntials(userData[splitUser]) : getIntials(`User ${+splitUser + 1}`)}
//                                             </div>
//                                           )
//                                         })}

//                                         {expense[1].length > 3 && (
//                                           <div
//                                             className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gray-600 border-white shadow-lg flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0"
//                                             style={{
//                                               marginLeft: '-10px',
//                                               zIndex: 0,
//                                             }}
//                                           >
//                                             +{expense[1].length - 3}
//                                           </div>
//                                         )}
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>

//                                 <button
//                                   ref={el => buttonRefs.current[`${index}${expIndex}`] = el}
//                                   className="border p-1 sm:p-2 rounded-lg bg-white ml-2 flex-shrink-0"
//                                   onClick={() => `${index}${expIndex}` === toggleDropdownIndex ? setToggleDropdownIndex('x') : setToggleDropdownIndex(`${index}${expIndex}`)}
//                                 >
//                                   {`${index}${expIndex}` === toggleDropdownIndex ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//                                 </button>
//                               </div>

//                               <div ref={el => dropdownRefs.current[`${index}${expIndex}`] = el} className="absolute top-[100%] right-0 z-10 bg-white">
//                                 <div className={`grid duration-300 ease-out ${`${index}${expIndex}` === toggleDropdownIndex ? 'grid-rows-[1fr] border' : 'grid-rows-[0fr] border-0'}`}>
//                                   <div className='overflow-hidden'>
//                                     <label className="block px-4 hover:bg-gray-100">
//                                       <input
//                                         type="checkbox"
//                                         className="mr-2"
//                                         checked={isEveryoneSelected}
//                                         onChange={() => handleSelectEveryoneToggle(index, expIndex)}
//                                       />
//                                       <span>Everyone</span>
//                                     </label>
//                                     {Object.entries(userData).map(([id, name]) => {
//                                       return (
//                                         <label key={id} className="block ml-3 px-4 max-w-40 overflow-hidden whitespace-nowrap text-ellipsis">
//                                           <input
//                                             type="checkbox"
//                                             checked={expense[1].includes(id)}
//                                             onChange={() => handleCheckboxChange(index, expIndex, id)}
//                                             className="mr-2"
//                                           />
//                                           {name ? name : `User ${+id + 1}`}
//                                         </label>
//                                       )
//                                     })}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })
//                     }
//                     <button className='cursor-pointer' onClick={() => addExpense(index)}>Add Expense</button>

//                   </div>
//                 </>
//               )
//             })
//           }
//         </div>
//         {/* </form> */}
//         {/* <div onClick={() => setIsOpen((prev)=>!prev)}>Click me</div>
//         <div className={`grid duration-200 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} border-solid border-2`}>
//           <div className="overflow-hidden">
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, voluptates.
//           </div>
//         </div> */}



//         {/* <div className="flex relative border-2 w-[150px]" id="parentDiv">
//           <div id="flex-item-1" className="w-20 h-20 bg-blue-500"></div>
//           <div id="flex-item-2" className="w-20 h-20 bg-green-500"></div>

//           <div
//             id="dont-want-to-be-flex-item"
//             className="absolute top-20 right-0 w-12 h-12 bg-red-500"
//           >
//             I'm over them
//           </div>
//         </div> */}
//       </div>
//       {/* <OverlappingCircles /> */}
//     </div> */}