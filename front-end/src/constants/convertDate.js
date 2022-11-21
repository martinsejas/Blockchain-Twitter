export function convertDateToRightFormat(dateInSeconds)
{
    let currentTime = Math.floor(new Date().getTime() / 1000); 
    let remainingTime = currentTime - dateInSeconds; 

    if(remainingTime < 60)
    {
        return `${remainingTime}s ago`
    }
    else if(remainingTime >= 60 && remainingTime < 3600)
    {
       return `${Math.floor(remainingTime/60)} min ago`
    }
    else if (remainingTime >=3600 && remainingTime < 86400 )
    {
        let hours = Math.floor(remainingTime/3600); 
        if(hours === 1)
        {
            return `1 hour ago`;
        }
        else 
        {
            return `${hours} hours ago`
        }
    }
    else{
        let days = Math.floor(remainingTime/86400); 
        if(days === 1)
        {
            return "1 day ago"
        }
        else{
            return`${days} days ago`
        }
    }
}

export default convertDateToRightFormat; 