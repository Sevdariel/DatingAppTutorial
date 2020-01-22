using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.DTO.Role;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using DatingApp.API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        public AdminController(DataContext context, UserManager<User> userManager,
            IDatingRepository datingRepository, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            this.context = context;
            this.userManager = userManager;
            this.datingRepository = datingRepository;
            this.cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(cloudinaryConfig.Value.CloudName, cloudinaryConfig.Value.ApiKey, cloudinaryConfig.Value.ApiSecret);

            cloudinary = new Cloudinary(acc);
        }
        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("usersWithRoles")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var userList = await context.Users
            .OrderBy(x => x.UserName)
            .Select(user => new
            {
                Id = user.Id,
                UserName = user.UserName,
                Roles = (from userRole in user.UserRoles
                         join role in context.Roles
                         on userRole.RoleId equals role.Id
                         select role.Name).ToList()
            }).ToListAsync();

            return Ok(userList);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("editRoles/{username}")]
        public async Task<IActionResult> EditRoles(string userName, RoleEditDto roleEditDto)
        {
            var user = await userManager.FindByNameAsync(userName);

            var userRoles = await userManager.GetRolesAsync(user);

            var selectedRoles = roleEditDto.RoleNames;

            selectedRoles = selectedRoles ?? new string[] { };

            var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to add to roles");

            result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to remove the roles");

            return Ok(await userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photosForModeration")]
        public async Task<IActionResult> GetPhotosForModeration()
        {
            var photosList = await context.Photos
            .Include(u => u.User)
            .IgnoreQueryFilters()
            .Select(u => new
            {
                Id = u.Id,
                UserName = u.User.UserName,
                Url = u.Url,
                IsAproved = u.IsAproved
            }).Where(p => !p.IsAproved).ToListAsync();

            return Ok(photosList);
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("aprovePhoto/{id}")]
        public async Task<IActionResult> AprovePhoto(int id)
        {
            var photo = await datingRepository.GetPhoto(id);

            photo.IsAproved = true;

            if (await datingRepository.SaveAll())
                return Ok();

            return BadRequest("Couln't aprove photo");
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpDelete("rejectPhoto/{id}")]
        public async Task<IActionResult> RejectPhoto(int id)
        {
            var photoFromRepo = await datingRepository.GetPhoto(id);

            if (photoFromRepo.IsMain)
                return BadRequest("You cannot reject the main photo");
                
            if (photoFromRepo.PublicId != null)
            {
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);
                var result = cloudinary.Destroy(deleteParams);

                if (result.Result == "ok")
                    datingRepository.Delete(photoFromRepo);
            }

            if (photoFromRepo.PublicId == null)
                datingRepository.Delete(photoFromRepo);

            if (await datingRepository.SaveAll())
                return Ok();

            return BadRequest("Failed to delete the photo");
        }

        private readonly DataContext context;
        private Cloudinary cloudinary;
        private readonly UserManager<User> userManager;
        private readonly IDatingRepository datingRepository;
        private readonly IOptions<CloudinarySettings> cloudinaryConfig;
    }
}