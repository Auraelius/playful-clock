export default function translateStatus(jobStatus){
  let resStatus = {code:'200', message:'OK'};
  switch (jobStatus) {

    case 'completed':
      resStatus.code = 200;
      resStatus.message = 'OK: job completed';
      break;

    case 'failed':
    case 'delayed':
    case 'active':
    case 'waiting':
    case 'paused':
    case 'stuck':
    case 'null':
      resStatus.code = 500;
      resStatus.message = `Server error: job ${jobStatus}`;
      break;
      
    default:
      resStatus.code = 500;
      resStatus.message = `Server error: unknown job status: ${jobStatus}`;
      break;
  }
  return(resStatus);
}