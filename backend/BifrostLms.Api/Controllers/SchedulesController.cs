using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BifrostLms.Api.Core.Entities;
using BifrostLms.Api.Data;

namespace BifrostLms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SchedulesController : ControllerBase
{
    private readonly AppDbContext _context;

    public SchedulesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Schedules
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Schedule>>> GetSchedules()
    {
        return await _context.Schedules.OrderBy(s => s.StartTime).ToListAsync();
    }

    // GET: api/Schedules/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Schedule>> GetSchedule(int id)
    {
        var schedule = await _context.Schedules.FindAsync(id);

        if (schedule == null)
        {
            return NotFound();
        }

        return schedule;
    }

    // POST: api/Schedules
    [HttpPost]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<Schedule>> PostSchedule(Schedule schedule)
    {
        schedule.CreatedAt = DateTime.UtcNow;
        _context.Schedules.Add(schedule);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSchedule), new { id = schedule.Id }, schedule);
    }

    // PUT: api/Schedules/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> PutSchedule(int id, Schedule schedule)
    {
        if (id != schedule.Id)
        {
            return BadRequest();
        }

        var existingSchedule = await _context.Schedules.FindAsync(id);
        if (existingSchedule == null)
        {
            return NotFound();
        }

        existingSchedule.Title = schedule.Title;
        existingSchedule.StartTime = schedule.StartTime;
        existingSchedule.EndTime = schedule.EndTime;
        existingSchedule.Location = schedule.Location;
        existingSchedule.MeetingUrl = schedule.MeetingUrl;
        existingSchedule.UpdatedAt = DateTime.UtcNow;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ScheduleExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Schedules/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> DeleteSchedule(int id)
    {
        var schedule = await _context.Schedules.FindAsync(id);
        if (schedule == null)
        {
            return NotFound();
        }

        _context.Schedules.Remove(schedule);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ScheduleExists(int id)
    {
        return _context.Schedules.Any(e => e.Id == id);
    }
}
